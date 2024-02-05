module.exports = {
  name: "$userTag",
  callback: (context) => context.event.user.username,
}