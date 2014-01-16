function playSound (sound) {
var snd = null;
if (typeof Audio != 'undefined') {
        snd = new Audio();
}
if (snd) {
if ((new Audio()).canPlayType("audio/ogg; codecs=vorbis")) {
                snd = new Audio(sound+".ogg");
} else {
                snd = new Audio(sound+".wav");
}
                snd.play();
}
}
