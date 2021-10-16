/**
 * @typedef User
 * @property { number } userId
 * @property { string } username
 * @property { string } email
 * @property { string } password
 *
 * @typedef Transaction
 * @property { number } transactionId
 * @property { number } userId
 * @property { Date } transactionDate
 * @property { number } amount
 * @property { boolean } isDeposit
 * @property { string } status
 *
 * @typedef IdentityProvider
 * @property { number } identityProviderId
 * @property { string } identityProvider
 *
 * @typedef UserIdentity
 * @property { number } customerId
 * @property { number } userId
 * @property { object } profileData
 *
 * @typedef ChatHistory
 * @property { number } chatMessageId
 * @property { number } userId
 * @property { number } chatRoomId
 * @property { string } message
 *
 * @typedef ChatRoom
 * @property { number } chatRoomId
 * @property { string } chatRoomName
 *
 * @typedef BetHistory
 * @property { number } betId
 * @property { number } userId
 * @property { number } gameRoundId
 * @property { Date } betDate
 * @property { number } betAmount
 * @property { number } betPayout
 * @property { string } betStake
 *
 * @typedef GameRound
 * @property { number } gameRoundId
 * @property { number } gameId
 * @property { string } result
 * @property { Date } roundDate
 * @property { boolean } acceptingBets
 *
 * @typedef Game
 * @property { number } gameId
 * @property { string } gameName
 */

module.exports = {};
