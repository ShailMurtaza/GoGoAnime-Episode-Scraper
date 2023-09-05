def anime_to_dict(anime):
    anime_dict = {}
    for i in anime:
        anime_dict[i.id] = i.title
    return anime_dict


def ep_to_dict(ep):
    ep_list = []
    for i in ep:
        ep_list.append([i.title, i.url])
    return ep_list
