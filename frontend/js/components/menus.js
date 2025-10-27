(function(){
  const noop = () => {};
  const methods = ['log','info','warn','error','debug'];
  window.console = window.console || {};
  methods.forEach(m => { if (!console[m]) console[m] = noop; });
})();

const getAndShowParentMenus = async () => {
  const headerMenu = document.querySelector('.header-bottom__menu');
  if (!headerMenu) return;

  const res = await fetch(`http://localhost:5000/api/categories/with-children?ts=${Date.now()}`);
  const result = await res.json();
  
  headerMenu.innerHTML = '';
  result.forEach(menu => {
    const li = document.createElement('li');
    li.className = 'header-bottom__item';
    li.dataset.id = menu._id;

    const a = document.createElement('a');
    a.href = `products.html?category=${menu._id}`;
    a.className = 'header-bottom__link';
    a.innerHTML = `<i class="${menu.icon || ''} header-bottom__icon"></i> ${menu.name} `;
    a.addEventListener('click', e => {
      console.log('Parent clicked:', a.href);
    });
    li.appendChild(a);
    headerMenu.appendChild(li);

    li.addEventListener('mouseenter', () => handleMouseEnter(li, result));
  });

  return result;
};

const handleMouseEnter = (liElem, allMenus) => {
  const mainParent = allMenus.find(m => m._id === liElem.dataset.id);
  const old = liElem.querySelector('.header-bottom__sub');
  if (old) old.remove();

  if (mainParent?.children?.length) {
    const dropdown = document.createElement('ul');
    dropdown.className = 'header-bottom__sub';
    dropdown.style.position = 'absolute';
    dropdown.style.top = '100%';
    dropdown.style.left = '0';

    mainParent.children.forEach(child => {
      const subLi = document.createElement('li');
      subLi.className = 'header-bottom__sub-item';

      const subLink = document.createElement('a');
      subLink.className = 'header-bottom__sub-link';
      subLink.href = `products.html?category=${child._id}`;
      subLink.textContent = child.name;

      subLi.appendChild(subLink);
      dropdown.appendChild(subLi);
    });
    liElem.appendChild(dropdown);
  }
};

// event delegation برای کلیک روی ساب‌لینک‌ها
document.addEventListener('click', function(e) {
  const a = e.target.closest('.header-bottom__sub-link');
  if (a) {
    console.log('sub link clicked:', a.href);
    // e.preventDefault();
    // window.location.href = a.href;
  }
});

export { getAndShowParentMenus };
