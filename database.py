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
        print(anime_list)
        return anime_list
    
    def is_anime(self, ID):
        anime = self.query(f"SELECT * FROM Anime WHERE id={ID}").fetchone()
        if not anime:
            return None
        return Anime(anime)
    
    def set_anime_index(self, ID, index):
        self.query(f"UPDATE Anime SET 'index'={index} where id={ID}")
        self.commit()

    def anime_ep_list(self, ID):
        data = self.query(f"SELECT * FROM EP_list WHERE anime_id={ID}").fetchall()
        ep_list = []
        for i in data:
            ep_list.append(EP_list(i))
        return ep_list

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
