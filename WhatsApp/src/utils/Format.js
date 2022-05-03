export class Format {
  
  static getCamelCase(text){
    let div = document.createElement('div')
    div.innerHTML = `<div data-${text}="id"></div >`
    return Object.keys(div.firstChild.dataset)[0]
  }

  static toTime(time){
    let seconds = parseInt((time / 1000) % 60).toString().padStart(2, '0')
    let minutes = parseInt((time / 60000) % 60).toString().padStart(2, '0')
    let hours = parseInt((time / (60000*60)) % 24)

    if(hours > 0) return `${hours}:${minutes}:${seconds}`
    return `${minutes}:${seconds}`
  }

  static dateToTime(date, locale = 'pt-BR') {
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static timeStampToTime(timeStamp) {
    return (timeStamp && typeof timeStamp.toDate === 'function') ? Format.dateToTime(timeStamp.toDate()) : '';
  }

}