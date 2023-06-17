export const defaultValue = async (context, next) => {

  console.log(`Running hook default-value on ${context.path}.${context.method}`)

  const acceptedPathForDate = ['users', 'requests', 'discussions', 'messages', 'contacts']

  const nowDate = Date.now();

  if (acceptedPathForDate.includes(context.path)) {

    if (context.method === 'create') {
      if (context.data) {
  
        context.data.createdAt = nowDate;
        context.data.updatedAt = nowDate;
      }
    }
  
    if (context.method === 'patch') {
      if (context.data) {
        context.data.updatedAt = nowDate;
      }
    }

  }
  // Code avant déclenchement de la fonction du service
  
  await next()

  // Code après déclenchement de la fonction du service

}
