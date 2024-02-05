module.exports = {
  name: "$delete",
  callback: (context) => {
    context.event.delete();
    if(context.isError) return;
  }
}