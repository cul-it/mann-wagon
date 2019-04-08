export default {
  // Override default dropdown template for sui dropdown component
  // -- Generates dropdown from select values using <span> for embedded icon component
  dropdown: function(select) {
    var
      placeholder = select.placeholder || false,
      values = select.values || {},
      html = ''
    html += '<span class="dropdown icon"></span>'
    if (select.placeholder) {
      html += '<div class="default text">' + placeholder + '</div>'
    }
    else {
      html += '<div class="text"></div>'
    }
    html += '<div class="menu">'
    $.each(select.values, function (index, option) {
      html += (option.disabled)
        ? '<div class="disabled item" data-value="' + option.value + '">' + option.name + '</div>'
        : '<div class="item" data-value="' + option.value + '">' + option.name + '</div>'
    })
    html += '</div>'
    return html
  }
}