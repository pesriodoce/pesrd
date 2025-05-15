const Utils = {
  debounce: function(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  },

  formatCurrency: function(value) {
    if (!value) return 'R$ 0,00';
    value = value.replace(/\D/g, '');
    value = (parseInt(value, 10) / 100).toFixed(2).toString();
    value = value.replace('.', ',');
    return 'R$ ' + value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  },

  validateEmail: function(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  scrollToElement: function(elementId, offset = 20) {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }
};