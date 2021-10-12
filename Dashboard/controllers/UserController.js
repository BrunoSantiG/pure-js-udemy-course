class UserController {
  #requiredFields = ['name', 'email', 'password']
  constructor(formIdCreate, formIdUpdate, tableId){
    this.formEl = document.getElementById(formIdCreate)
    this.formUpdateEl = document.getElementById(formIdUpdate)
    this.tableEl = document.getElementById(tableId)

    this.onSubmit()
    this.editEvents()
  }

  showPanel(panel){
    let createPanel = document.querySelector('#box-user-create').classList
    let editPanel = document.querySelector('#box-user-edit').classList

    if(panel === 'edit'){
      createPanel.add('d-none')
      editPanel.remove('d-none')
    }else if(panel === 'create'){
      createPanel.remove('d-none')
      editPanel.add('d-none')
    }
  }

  addTREvents(tr){

    tr.querySelector('.btn-delete').addEventListener('click',e => {
      if(confirm("Deseja realmente excluir?")){
        tr.remove()
        this.updateStatistics()
      }
    })

    tr.querySelector('.btn-edit').addEventListener('click',e => {
      const json = JSON.parse(tr.dataset.user) 

      this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex

      for(let name in json){
        const field = this.formUpdateEl.querySelector(`[name=${name.replace('_','')}]`)
        
        if(field){
          switch (field.type) {
            case 'file':
              continue
              break
            case 'radio':
              this.formUpdateEl.querySelector(`[name=${name.replace('_','')}][value=${json[name]}]`).checked=true
              break
            case 'checkbox':
              field.checked = json[name]
              break
          
            default:
              field.value = json[name]
          }
        }
      }

      this.formUpdateEl.querySelector('.photo').src=json._photo
      this.showPanel('edit')
    })
  }

  createTR(data){
    return `
      <td>
        <img src="${data._photo}" alt="User Image" class="img-circle img-sm">
      </td>
      <td>${data._name}</td>
      <td>${data._email}</td>
      <td>${data._admin?'Sim':'Não'}</td>
      <td>${Utils.dateFormat(data._register)}</td>
      <td>
        <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
        <button type="button" class="btn btn-danger btn-xs btn-flat btn-delete">Excluir</button>
      </td>`
  }

  editEvents(){
    document.querySelector('#box-user-edit .btn-cancel').addEventListener('click', e => {
      this.showPanel('create')
    })

    this.formUpdateEl.addEventListener('submit', e => {
      e.preventDefault()

      let btn = this.formUpdateEl.querySelector('[type=submit]')
      btn.disabled = true

      let values = this.getFormValues(this.formUpdateEl)

      const index = this.formUpdateEl.dataset.trIndex

      const tr = this.tableEl.rows[index]

      let oldUser = JSON.parse(tr.dataset.user)

      let result = Object.assign({},oldUser, values)

      

         

      this.getPhoto(this.formUpdateEl).then((content) => {

        if(!values.photo) {
          result._photo = oldUser._photo
        }else{
          result._photo = content
        }      

        tr.dataset.user = JSON.stringify(result)

        tr.innerHTML = this.createTR(result)

        this.addTREvents(tr)
        this.updateStatistics()   

        this.formUpdateEl.reset()
        this.showPanel('create')
      }).catch((e) => {
        console.log('catch: ', e)
      }).finally(()=>{
        btn.disabled = false
      })


    })
  }

  getFormValues(formEl){

    let user = {}
    let isValid = true
    const elements = [...formEl.elements]

    elements.forEach((field) => {

      if(this.#requiredFields.indexOf(field.name)>=0 && !field.value){
        field.parentElement.classList.add('has-error')
        isValid = false
      }

      if(field.name === 'gender'){
        if(field.checked){
          user[field.name] = field.value
        }
      }else if(field.name === 'admin'){
        user[field.name] = field.checked
      }else{
        user[field.name] = field.value
      }
  
    });

    return !isValid
    ? false 
    : new User(
      user.name, 
      user.gender, 
      user.birth, 
      user.country, 
      user.email, 
      user.password, 
      user.photo, 
      user.admin 
    )

  }

  getPhoto(formEl){

    return new Promise((resolve, reject) => {

      let fileReader = new FileReader()

      const elements = [...formEl.elements]

      const filteredElement = elements.filter((el)=> el.name === 'photo' && el)
      const file = filteredElement[0].files[0]

      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = (e) => {
        reject(e)
      }

      file? fileReader.readAsDataURL(file) : resolve('dist/img/boxed-bg.jpg')

    })

  }

  updateStatistics(){
    let nbUsers = 0 
    let nbAdmin = 0 
    const childrens = [...this.tableEl.children]

    childrens.forEach((children)=>{
      nbUsers++

      if(JSON.parse(children.dataset.user)._admin)
        nbAdmin++
      
    })

    document.querySelector('#nb-users').innerHTML = nbUsers
    document.querySelector('#nb-admin').innerHTML = nbAdmin
  }

  renderUser(userData){
    let tr = document.createElement('tr')
    tr.dataset.user = JSON.stringify(userData)

    tr.innerHTML = this.createTR(JSON.parse(tr.dataset.user))

    this.addTREvents(tr)

    this.tableEl.appendChild(tr)

    this.updateStatistics()
  }

  onSubmit(){
    this.formEl.addEventListener('submit', (e)=>{
      e.preventDefault()
      
      let btn = this.formEl.querySelector('[type=submit]')
      btn.disabled = true

      let values = this.getFormValues(this.formEl)

      if(!values) return 

      this.getPhoto(this.formEl).then((content) => {
        values.photo = content
        this.renderUser(values)

        this.formEl.reset()
      }).catch((e) => {
        console.log('catch: ', e)
      }).finally(()=>{
        btn.disabled = false
      })

      
    })
  }

}