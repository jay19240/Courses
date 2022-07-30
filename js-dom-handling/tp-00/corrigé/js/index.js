window.onload = function () {
  let routerView = document.querySelector('#router-view');
  let btnHome = document.querySelector('#btn-home');
  let btnAbout = document.querySelector('#btn-about');
  let btnServices = document.querySelector('#btn-services');
  let btnContact = document.querySelector('#btn-contact');

  activeMenuItem('btn-home');
  let home = document.querySelector('#home');
  routerView.innerHTML = '';
  routerView.appendChild(home.cloneNode(true));

  btnHome.addEventListener('click', function() {
    activeMenuItem('btn-home');
    let home = document.querySelector('#home');    
    routerView.innerHTML = '';
    routerView.appendChild(home.cloneNode(true));
  });

  btnAbout.addEventListener('click', function() {
    activeMenuItem('btn-about');
    let about = document.querySelector('#about');
    routerView.innerHTML = '';
    routerView.appendChild(about.cloneNode(true));
  });

  btnServices.addEventListener('click', function() {
    activeMenuItem('btn-services');
    let services = document.querySelector('#services');
    routerView.innerHTML = '';
    routerView.appendChild(services.cloneNode(true));
  });

  btnContact.addEventListener('click', function() {
    activeMenuItem('btn-contact');
    let contact = document.querySelector('#contact');
    routerView.innerHTML = '';
    routerView.appendChild(contact.cloneNode(true));
  });

  function activeMenuItem(id) {
    let btns = document.querySelectorAll('.nav-menu > a');
    for (let btn of btns) {
      if (btn.id == id) {
        btn.classList.add('active');
      }
      else {
        btn.classList.remove('active');
      }
    }
  }
}