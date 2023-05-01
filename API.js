function loadListEpisode(obj, ep_start, ep_end, id, default_ep, alias) {
    $("#load_ep").html('<div class="loader"></div>');
    disabledHome(obj);
    $.ajax({
        url:
            base_url_cdn_api +
            "ajax/load-list-episode?ep_start=" +
            ep_start +
            "&ep_end=" +
            ep_end +
            "&id=" +
            id +
            "&default_ep=" +
            default_ep +
            "&alias=" +
            alias,
        type: "GET",
        dataType: "html",
        async: false,
        crossDomain: !0,
        success: function (data) {
            $("#load_ep").html(data);
        },
    });
}

var base_url_cdn_api = 'https://ajax.gogo-load.com/';

if (document.getElementById('episode_page')) {
    var ep_start = $('#episode_page a.active').attr('ep_start');
    var ep_end = $('#episode_page a.active').attr('ep_end');
    var id = $("input#movie_id").val();
    var default_ep = $("input#default_ep").val();
    var alias = $("input#alias_anime").val();
    loadListEpisode('#episode_page a.active', ep_start, ep_end, id, default_ep, alias);
}
