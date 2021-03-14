'use strict'

/**
 * Get the access token along with an optional refresh token.
 *
 * @instance
 * @memberof TDAmeritrade
 * @param {string} authCode The authorization code
 * @returns {Promise<any>} The token details
 *
 * @example
 * const token = await td.getAccessToken('authorization-code-goes-here')
 */
function getAccessToken(authCode) {
    const params = new URLSearchParams()
    params.append('grant_type', 'authorization_code')
    params.append('access_type', this.config.accessType || 'offline')
    params.append('client_id', this.config.apiKey)
    params.append('redirect_uri', this.config.redirectUri)
    params.append('code', authCode || this.config.authCode)

    delete this.config.accessToken

    return this.axios.post('/oauth2/token', params)
} // getAccessToken()

/**
 * Refresh the access token.
 *
 * @instance
 * @memberof TDAmeritrade
 * @param {string} [refreshToken] The refresh token
 * @returns {Promise<any>} The token details
 *
 * @example
 * const token = await td.refreshAccessToken('refresh-token-goes-here')
 */
function refreshAccessToken(refreshToken) {
    const params = new URLSearchParams()
    params.append('grant_type', 'refresh_token')
    params.append('client_id', this.config.apiKey)
    params.append('refresh_token', refreshToken || this.config.refreshToken)

    delete this.config.accessToken

    return this.axios.post('/oauth2/token', params)
} // refreshAccessToken()

/**
 * Refresh the refresh token.
 *
 * @instance
 * @memberof TDAmeritrade
 * @param {string} [refreshToken] The refresh token
 * @returns {Promise<any>} The token details
 *
 * @example
 * const token = await td.refreshRefreshToken('refresh-token-goes-here')
 */
function refreshRefreshToken(refreshToken) {
    const params = new URLSearchParams()
    params.append('grant_type', 'refresh_token')
    params.append('access_type', this.config.accessType || 'offline')
    params.append('client_id', this.config.apiKey)
    params.append('refresh_token', refreshToken || this.config.refreshToken)

    delete this.config.accessToken

    return this.axios.post('/oauth2/token', params)
} // refreshRefreshToken()

/**
 * Determine if access token is expired.
 *
 * @instance
 * @memberof TDAmeritrade
 * @returns {boolean} True if expired, otherwise false
 */
function isAccessTokenExpired() {
    return this.config.accessTokenExpiresAt
        ? new Date(this.config.accessTokenExpiresAt).getTime() <= Date.now()
        : true
} // isAccessTokenExpired()

/**
 * Determine if refresh token is expired.
 *
 * @instance
 * @memberof TDAmeritrade
 * @returns {boolean} True if expired, otherwise false
 */
function isRefreshTokenExpired() {
    return this.config.refreshTokenExpiresAt
        ? new Date(this.config.refreshTokenExpiresAt).getTime() <= Date.now()
        : true
} // isRefreshTokenExpired()

/**
 * Determine if refresh token expires within 7 days.
 *
 * @instance
 * @memberof TDAmeritrade
 * @returns {boolean} True if expiration is within 7 days, otherwise false
 */
function isRefreshTokenExpiringSoon() {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7)
    return this.config.refreshTokenExpiresAt
        ? new Date(this.config.refreshTokenExpiresAt).getTime() <= futureDate.getTime()
        : true
} // isRefreshTokenExpiringSoon()

module.exports = {
    getAccessToken,
    refreshAccessToken,
    refreshRefreshToken,
    isAccessTokenExpired,
    isRefreshTokenExpired,
    isRefreshTokenExpiringSoon,
}
