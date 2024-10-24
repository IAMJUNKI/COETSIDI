const { Op } = require('sequelize'); // Sequelize's operators to perform date comparison
const Sesiones = require('@db/models/sesiones.js')

const sessionCount = async (userId) => {
  try {
    const session = await Sesiones.findOne({ where: { user_id: userId } });

    const currentTime = new Date();

    if (session) {
      // Check if the last session was less than 10 minutes ago
      const tenMinutesAgo = new Date(currentTime.getTime() - 10 * 60 * 1000);

      if (session.last_session && session.last_session > tenMinutesAgo) {
          // Last session was less than 10 minutes ago, update only the last_session timestamp
          await session.update({
              last_session: currentTime
          });
      } else {
          // Last session was more than 10 minutes ago, increment total_sessions and update last_session
          await session.update({
              last_session: currentTime,
              total_sessions: session.total_sessions + 1
          });
      }
    } else {

        await Sesiones.create({
            user_id: userId,
            last_session:  currentTime
        });
    }

} catch (error) {
    console.error('Error in sessionCountServices:', error);
    throw error;
}
}

module.exports = {
  sessionCount
}
