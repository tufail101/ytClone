export const fromateDuraction = (sec) => {
    const minuts = Math.floor(sec / 60);
    const remainSecond = Math.floor(sec % 60)
    return `${minuts}:${remainSecond < 10 ? "0":""}${remainSecond}`
}