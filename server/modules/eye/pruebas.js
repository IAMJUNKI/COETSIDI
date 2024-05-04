
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

//   console.log(generateRandomString(30))



  const bcrypt = require('bcrypt');
const saltRounds = 10;
const password = '123';
const wrongPassword = 'not_bacon';
  let hashed = '$2b$10$XjaKtRLRIrjN8rjPiy41P.z6pVInVIl5KolyBNJ59m.mAE/qKgvbC'
// hash and unhash passwords----------------------------------------


//     bcrypt.hash(pass, saltRounds, async function(err, hash) {
//        try {
//            hashed = await hash
//            console.log(hash,err)
//        } catch (error) {
//            console.log(error)
//        }
//    })


// console.log(pass)

    // bcrypt.compare(password, hashed, async function(err, res) {
    //     if (res) {
    //      // Passwords match
    //      console.log(res,'matches')
    //     } else {
    //         console.log(res,'not match')
    //      // Passwords don't match
    //     }
    //   });

    
const comparePasswords = async (password, hashed) => {
  try {
    const matchFound = await bcrypt.compare(password, hashed);
    console.log(matchFound)
    return matchFound;
  } catch (err) {
    console.log(err);
  }
  return false;
};  

comparePasswords(password,hashed)