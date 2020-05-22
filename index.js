const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36"
}

const getTrack = (html) => {
    const data = JSON.parse(html.match(/(\[{"id")(.*?)(?=\);)/)?.[0])
    const track = data[5].data[0]
    return track
}

document.getElementById("submit").onclick = async () => {
    const textBox = document.getElementById("link")
    const dlElement = document.getElementById("dl-link")
    const audioElement = document.getElementById("audio-file")
    const metadata = document.getElementById("metadata")
    let result = ""
    try {
        result = await fetch(`https://cors-anywhere.herokuapp.com/${textBox.value}`, {headers}).then((r) => r.ok ? r.text() : Promise.reject("error"))
    } catch {
        textBox.value = ""
        dlElement.innerHTML = "Invalid URL"
        return
    }
    // const match = result.match(/(,{"url":")(.*?)(progressive)/)?.[0].replace(`,{"url":"`, "")
    const track = getTrack(result)
    const clientId = "yxIg2AHK1T7qjR5DnGHgDEftYB00McqD"
    const mp3 = await fetch(`https://cors-anywhere.herokuapp.com/${track.media.transcodings[1].url}?client_id=${clientId}`, {headers}).then((r) => r.json()).then((m) => m.url)
    dlElement.innerHTML = `<a href="${mp3}" download id="download">${mp3}</a>`
    metadata.innerHTML = `
    <p><strong>Artist: </strong><a href="${track.user.permalink_url}">${track.user.username}</a> <strong>Track: </strong><a href="${track.permalink_url}">${track.title}</a></p>
    <br>
    <a href="${track.artwork_url}"><img src="${track.artwork_url}"/></a>
    <br>
    <br>
    `
    // document.getElementById('download').click()
    audioElement.innerHTML = `<audio src="${mp3}" type="audio/mpeg" controls></audio>`
    // audioElement.innerHTML = `<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track.id}&color=%23ff34d2&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="${track.user.permalink_url}" title="${track.user.username}" target="_blank" style="color: #cccccc; text-decoration: none;">${track.user.username}</a> · <a href="${track.permalink_url}" title="${track.title}" target="_blank" style="color: #cccccc; text-decoration: none;">${track.title}</a></div>`
    textBox.value = ""
}