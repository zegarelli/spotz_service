function selectNameAndId (builder) {
  builder.select('name', 'id')
}

function selectIdAndDescription (builder) {
  builder.select('id', 'details')
}

module.exports = {
  selectNameAndId,
  selectIdAndDescription
}
