class CalcController {

  constructor(){
    this._operation = []
    this._lastOperator = ''
    this._lastNumber = ''
    this._operation = []
    this._isAudioOn = false

    this._locale = 'pt-BR'
    this._displayCalcEl = document.querySelector('#display')
    this._dateEl = document.querySelector('#data')
    this._timeEl = document.querySelector('#hora')
    this.currentDate
    this._audio = new Audio('click.mp3')

    this.initialize()
  }

  initialize(){
    
    this._initButtonsEvents()
    this._setDisplayDateTime()

    setInterval(() => {
      this._setDisplayDateTime()
    },1000)

    this.initKeyboardEvents()

    this.setLastNumberToDisplay()

    document.querySelectorAll('.btn-ac').forEach(el => {
      el.addEventListener('dblclick', e => {

        this.toggleAudio()

      })
    })
    
  }

  toggleAudio(){
    this._isAudioOn = !this._isAudioOn
  }

  playAudio(){
    if(this._isAudioOn) {
      this._audio.currentTime = 0
      this._audio.play()
    }
  }

  pasteFromClipboard(){
    document.addEventListener('paste', e => {
      let text = +e.clipboardData.getData('text')

      this.displayCalc = text
      this.addOperatation(text)
    })
  }

  copyToClipBoard(){
    let input = document.createElement('input')

    input.value = this.displayCalc

    document.body.appendChild(input)

    input.select()

    document.execCommand("copy")

    input.remove()
  }

  initKeyboardEvents(){

    this.pasteFromClipboard()

    document.addEventListener('keyup', e =>{
      this.playAudio()
      switch (e.key) {
        case 'Escape':
          this.clearAll()
          break
        case 'Backspace':
          this.clearEntry()
          break
        case '+':
        case '-':
        case '/':
        case '*':
        case '%':
          this.addOperatation(e.key)
          break
        case '=':
        case 'Enter':
          this.calc()
          break
        case '.':
        case ',':
          this.addDot()
          break
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.addOperatation(+e.key)
          break
        case 'c':
          e.ctrlKey && this.copyToClipBoard()
          break
      }
    })
  }

  addEventListenerAll(element, events, fn){
    events.split(' ').forEach(event =>{
      element.addEventListener(event, fn)
    })
  }

  getLastOperation(a){
    return a[a.length-1]
  }

  setLastOperation(value){
    this._operation[this._operation.length-1]=value
  }

  isOperator(value){
    return (['+','-','/','*','%'].indexOf(value) > -1)
  }

  getResult(){
    try {
      return eval(this._operation.join(''))
    } catch (error) {
      setTimeout(()=>{
        this.setError()
      },1)
    }
  }

  calc(){
    let lastOperation = ''
    
    this._lastOperator = this.getLastItem() ? this.getLastItem() : this._lastOperator

    if(this._operation.length < 3){
      let firstItem = this._operation[0]
      this._operation = [firstItem, this._lastOperator, this._lastNumber]
    }

    if(this._operation.length > 3){

      lastOperation = this._operation.pop()

      this._lastNumber = this.getResult()

    }else if(this._operation.length === 3){
    
      this._lastNumber = this.getLastItem(false)
    
    }

    let result = this.getResult()

    if(lastOperation === '%'){

      result /= 100
      this._operation = [result]
    
    }else{

      this._operation = [result]

      if(lastOperation){

        this._operation.push(lastOperation)
      
      }

    }

    this.setLastNumberToDisplay()
    
  }

  pushOperation(value){
    this._operation.push(value)
    if(this._operation.length>3){
      this.calc()
    }
  }

  getLastItem(isOperator = true){
    let lastItem, i = this._operation.length-1
    while(!lastItem && i>=0){

      if(this.isOperator(this._operation[i]) === isOperator){
        lastItem = this._operation[i]
      }

      i--
    }

    return lastItem
  }

  setLastNumberToDisplay(){
    let lastNumber = this.getLastItem(false)
    if(!lastNumber) lastNumber = 0
    this.displayCalc = lastNumber
  }

  addOperatation(value){
    const lastOperation = this.getLastOperation(this._operation)
    if(isNaN(lastOperation)){

      if(this.isOperator(value)){

        this.setLastOperation(value)

      }else{
        this.pushOperation(value)
        this.setLastNumberToDisplay()
      }
    }else{ 
      if(this.isOperator(value)){
      
        this.pushOperation(value)

      }else{
        this.setLastOperation(lastOperation + value.toString())
        this.setLastNumberToDisplay()
      }

    }
  }

  addDot(){
    let lastOperation = this.getLastOperation(this._operation)

    if(typeof lastOperation === 'string' && lastOperation.includes('.')) return

    if(!lastOperation || this.isOperator(lastOperation)){
      this.pushOperation('0.')
    }else{
      this.setLastOperation(lastOperation + '.')
    }
    this.setLastNumberToDisplay()
  }

  clearAll(){
    this._operation = []
    this._lastNumber = ''
    this._lastOperator = ''
    this.setLastNumberToDisplay()

  }
  clearEntry(){
    this._operation.pop()
    this.setLastNumberToDisplay()

  }
  setError(){
    this.displayCalc = "Error"
    this._operation = []
  }

  getButtonsAction(value){
    this.playAudio()
    switch (value) {
      case 'ac':
        this.clearAll()
        break
      case 'ce':
        this.clearEntry()
        break
      case 'soma':
        this.addOperatation('+')
        break
      case 'subtracao':
        this.addOperatation('-')
        break
      case 'divisao':
        this.addOperatation('/')
        break
      case 'multiplicacao':
        this.addOperatation('*')
        break
      case 'porcento':
        this.addOperatation('%')
        break
      case 'igual':
        this.calc()
        break
      case 'ponto':
        this.addDot()
        break
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        this.addOperatation(+value)
        break
      
      default:
        this.setError()
        break
    }
  }

  _initButtonsEvents(){
    let buttons = document.querySelectorAll('#buttons > g, #parts > g')

    buttons.forEach((btn) => {
      
      this.addEventListenerAll(btn, 'click drag', e => {
        let buttonAction = btn.className.baseVal.replace('btn-','')
        this.getButtonsAction(buttonAction)
      })

      this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {
        btn.style.cursor = "pointer"
      })

    })
  }

  _setDisplayDateTime(){
    this.displayDate = this.currentDate.toLocaleDateString(this._locale)
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
  }

  get displayTime(){
    return this._timeEl.innerHTML
  }
  set displayTime(value){
    this._timeEl.innerHTML = value
  }  

  get displayDate(){
    return this._dateEl.innerHTML
  }
  set displayDate(value){
    this._dateEl.innerHTML = value
  }  

  get displayCalc(){
    return this._displayCalcEl.innerHTML
  }
  set displayCalc(value){
    if(value.toString().length > 10){
      this.setError()
      return
    }
    this._displayCalcEl.innerHTML = value
  }  

  get currentDate(){
    return new Date()
  }  
  set currentDate(value){
    this.currentDate = value
  }
}