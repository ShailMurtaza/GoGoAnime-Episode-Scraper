def anime_to_dict(anime):
    anime_dict = {}
    for i in anime:
        anime_dict[i.id] = i.title
    return anime_dict
