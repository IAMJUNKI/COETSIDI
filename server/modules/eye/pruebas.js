
function generateRandomString(limit) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%#*@';
    const charactersLength = characters.length;
    for (let i = 0; i < limit; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  console.log(generateRandomString(30))