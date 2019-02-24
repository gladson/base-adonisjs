/**
 *
 * Scripts
 *
 */
async function isEmpty (obj) {
  // for (var key in obj) {
  //   if (obj.hasOwnProperty(key)) {
  //     return false
  //   }
  // }
  // return true
  if (JSON.stringify(obj) === '{}') {
    return false
  }
  return true
}
exports.isEmpty = isEmpty
