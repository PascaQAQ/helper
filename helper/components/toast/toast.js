import './toast.less'

export let toastIt = function (text, timeout, options = { fontSize: '18px' }) {

  // if exsits

  try {
    document.body.removeChild(document.querySelector('div.toast-it'))
  } catch (e) { }

  var timeout = timeout || 2500
  let toast = document.createElement('div')
  toast.classList.add('toast-it')
  let content = document.createTextNode(text)
  toast.appendChild(content)
  toast.style.animationDuration = timeout / 1000 + 's'

  for (let prop in options) 
    toast.style[prop] = options[prop]

  toast.style['z-index'] = 999999
  document.body.appendChild(toast)
  setTimeout(function () {
    try {
      document.body.removeChild(toast)
    } catch (e) {

    }
  }, timeout)
}
