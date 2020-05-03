function buildTree (comments) {
  const map = {}
  const topLevelComments = []
  for (const [index, item] of comments.entries()) {
    map[item.id] = index
    comments[index].children = []
  }
  for (const node of comments) {
    if (node.parentComment) {
      comments[map[node.parentComment]].children.push(node)
    } else {
      topLevelComments.push(node)
    }
  }
  return topLevelComments
}

module.exports = buildTree
