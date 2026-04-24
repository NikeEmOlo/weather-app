function applyStyleList(element, stylesObj) {
    Object.entries(stylesObj).forEach(([key, value]) => {
        element.style[key] = value;
    })
}

export {
    applyStyleList,
}