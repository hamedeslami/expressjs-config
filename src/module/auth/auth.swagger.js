/**
 * @swagger
 *  tags:
 *      name: Auth
 *      description: user authorization web service
 */


/**
 * @swagger
 *  components:
 *      schemas:
 *          SendOTP:
 *              type: object
 *              required:
 *                  - phoneNumber
 *              properties:
 *                  phoneNumber:
 *                      type: string
 */

/**
 * @swagger
 * 
 *  /auth/send-otp:
 *   post:
 *      summary: send otp to user
 *      tags:
 *           -  Auth
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/SendOTP"
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/SendOTP"
 *      response:
 *          200:
 *              description: successful
 * 
 */