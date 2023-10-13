function initHeader() {
  var htmlHeader = `
  <div class="logo">
    <img src="/static/logo.png" />
  </div>
  <span class="headerText">ตลาดไท Online</span>
  `
  document.querySelector('.topbar-wrapper').innerHTML = htmlHeader
  try {
    var descMessageSegments = document.querySelector('.renderedMarkdown').innerText.split(') API')
    var descMessage = descMessageSegments[0].split('ตลาดไท ')?.[1]
    if (descMessage) {
      let spanEnv = document.createElement("span");
      spanEnv.innerText = descMessage
      document.querySelector('.main').prepend(spanEnv)
    }
  } catch (error) {
    console.log('error', error)
  }
}

setTimeout(() => {
  initHeader();
}, 500)