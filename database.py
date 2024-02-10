import sqlite3


class Database():
    def __init__(self, database):
        self.connection = sqlite3.connect(database, check_same_thread=False)
        self.cursor = self.connection.cursor()

    def query(self, q):
        return self.cursor.execute(q)

    def commit(self):
        self.connection.commit()

    def anime_all(self):
        data = self.query("SELECT * FROM Anime").fetchall()
        anime_list = []
        for i in data:
            anime_list.append(Anime(i))
        return anime_list
    
    def get_anime(self, ID):
        anime = self.query(f"SELECT * FROM Anime WHERE id={ID}").fetchone()
        if not anime:
            return None
        return Anime(anime)

    def update_anime(self, anime):
        self.query(f"UPDATE Anime SET 'title'='{anime.title}', 'anime_url'='{anime.anime_url}', 'path'='{anime.path}', 'index'='{anime.index}' WHERE id='{anime.id}'")
        self.commit()

    def insert_anime(self, anime):
        result = self.query(f"INSERT INTO Anime ('title', 'anime_url', 'path', 'index') VALUES ('{anime.title}', '{anime.anime_url}', '{anime.path}', '{anime.index}') RETURNING id;")
        anime.id = result.fetchone()[0]
        self.commit()
        return anime
    
    def delete_anime(self, ID):
        self.query(f"DELETE FROM Anime WHERE id='{ID}'")
        self.query(f"DELETE from EP_list WHERE anime_id='{ID}'")
        self.commit()
    
    def anime_ep_list(self, ID):
        data = self.query(f"SELECT * FROM EP_list WHERE anime_id={ID}").fetchall()
        ep_list = []
        for i in data:
            ep_list.append(EP_list(i))
        return ep_list

    def insert_episode(self, episode):
        self.query(f"INSERT INTO EP_list ('anime_id', 'title', 'url') VALUES ('{episode.anime_id}', '{episode.title}', '{episode.url}');")

    def ep_list_count(self, ID):
        data = self.query(f"SELECT COUNT(*) FROM EP_list WHERE anime_id={ID}").fetchone()
        return data[0]
    


class Anime():
    def __init__(self, data):
        self.id = data[0]
        self.title = data[1]
        self.anime_url = data[2]
        self.path = data[3]
        self.index = data[4]


class EP_list():
    def __init__(self, data):
        self.id = data[0]
        self.anime_id = data[1]
        self.title = data[2]
        self.url = data[3]
