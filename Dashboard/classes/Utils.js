class Utils {
    static dateFormat(dateStr){
        const date = new Date(dateStr)
        return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes();
    }
}