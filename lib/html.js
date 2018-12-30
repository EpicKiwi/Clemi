// took from https://github.com/Polymer/polymer/blob/665901ab2483385cf6ae7037663ad0f992e9b930/lib/utils/html-tag.js#L93

function html(strings, ...values) {
  const template = document.createElement("template");
  template.innerHTML = values.reduce(
    (acc, v, idx) => acc + v + strings[idx + 1],
    strings[0]
  );
  return template;
}

module.exports = { html };
