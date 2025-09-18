
// === Collapsible Height via: https://css-tricks.com/using-css-transitions-auto-dimensions/

export function collapseSection(element) {
  element.removeEventListener('transitionend', onExpandEnd);
  //var sectionHeight = element.scrollHeight;
  const currentHeight = element.offsetHeight;

  var elementTransition = element.style.transition;
  element.style.transition = '';
  
  requestAnimationFrame(function() {
    element.style.height = currentHeight + 'px';
    element.style.transition = elementTransition;
    requestAnimationFrame(function() {
      element.style.height = 0 + 'px';
    });
  });
}

export function expandSection(element) {
  var sectionHeight = element.scrollHeight;
  element.style.height = sectionHeight + 'px';
  element.addEventListener('transitionend', onExpandEnd);
}

function onExpandEnd(e) {
  var element = e.target;
  element.removeEventListener('transitionend', onExpandEnd);
  element.style.height = 'auto';
}