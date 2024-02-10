import sqlite3


class Database():
    def __init__(self, database):
        self.connection = sqlite3.connect(database, check_same_thread=False)
        self.cursor = self.connection.cursor()

    # Execute query and then return result
    def query(self, q):
        return self.cursor.execute(q)

    # Commit changes
    def commit(self):
        self.connection.commit()

    # Fetch all anime
    def anime_all(self):
        data = self.query("SELECT * FROM Anime").fetchall()
        anime_list = []
        for i in data:
            anime_list.append(Anime(i))
        return anime_list
    
    # Return specific anime using Primary Key
    def get_anime(self, ID):
        anime = self.query(f"SELECT * FROM Anime WHERE id={ID}").fetchone()
        if not anime:
            return None
        return Anime(anime)

    # Take Anime object as parameter and set/update every feild of that anime using Primary Key
    def update_anime(self, anime):
        self.query(f"UPDATE Anime SET 'title'='{anime.title}', 'anime_url'='{anime.anime_url}', 'path'='{anime.path}', 'index'='{anime.index}' WHERE id='{anime.id}'")
        self.commit()

    # Insert new Anime, fetch its primary key and return Anime object with its primary key
    def insert_anime(self, anime):
        result = self.query(f"INSERT INTO Anime ('title', 'anime_url', 'path', 'index') VALUES ('{anime.title}', '{anime.anime_url}', '{anime.path}', '{anime.index}') RETURNING id;")
        anime.id = result.fetchone()[0]
        self.commit()
        return anime
    
    # Delete anime and its episodes using anime primary key
    def delete_anime(self, ID):
        self.query(f"DELETE FROM Anime WHERE id='{ID}'")
        self.query(f"DELETE from Episode WHERE anime_id='{ID}'")
        self.commit()
    
    # Return list of Episode object of that anime using primary key of anime
    def anime_ep_list(self, ID):
        data = self.query(f"SELECT * FROM Episode WHERE anime_id={ID}").fetchall()
        ep_list = []
        for i in data:
            ep_list.append(Episode(i))
        return ep_list

    # Take Episode object as parameter and insert new episode
    def insert_episode(self, episode):
        self.query(f"INSERT INTO Episode ('anime_id', 'title', 'url') VALUES ('{episode.anime_id}', '{episode.title}', '{episode.url}');")

    # Return number of episodes of anime using its primary key
    def episodes_count(self, ID):
        data = self.query(f"SELECT COUNT(*) FROM Episode WHERE anime_id={ID}").fetchone()
        return data[0]
    


class Anime():
    def __init__(self, data):
        self.id = data[0]
        self.title = data[1]
        self.anime_url = data[2]
        self.path = data[3]
        self.index = data[4]


class Episode():
    def __init__(self, data):
        self.id = data[0]
        self.anime_id = data[1]
        self.title = data[2]
        self.url = data[3]
