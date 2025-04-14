# Wujo Data Models (Frontend Perspective)

This document describes the primary data structures the frontend application will handle, primarily based on data received from and sent to the backend API. The backend manages the definitive database schema.

## 1. User

Represents a registered user (Collector or Member).

| Field                 | Type           | Description                                      | Frontend Validation      | API Example Key (Inferred) |
| :-------------------- | :------------- | :----------------------------------------------- | :----------------------- | :------------------------- |
| `id`                  | Number         | Unique identifier for the user.                  | -                        | `id`                       |
| `name`                | String         | User's full name.                                | Required, Non-empty      | `name`                     |
| `phone`               | String         | User's phone number (used for login).            | Required, Valid Format   | `phone`                    |
| `email`               | String         | User's email address (Optional?).               | Valid Email Format (if present) | `email` (if applicable)  |
| `gender`              | String         | User's gender ('male', 'female', 'other').      | Required                 | `gender`                   |
| `role`                | String         | User's role ('collector', 'member').             | Required ('collector'\|'member') | `role`                   |
| `profile_picture_url` | String         | URL to the user's profile picture (Optional).    | -                        | `profile_picture` (assumption) |
| `created_at`          | String (ISO)   | Timestamp when the user was created.             | -                        | `created_at`             |
| `token`               | String         | Authentication Bearer token (Stored client-side). | -                        | (Received on Login)      |

## 2. Iqub (ROSCA)

Represents a single Rotating Savings and Credit Association group.

| Field                | Type         | Description                                     | Frontend Validation | API Example Key (Inferred) |
| :------------------- | :----------- | :---------------------------------------------- | :------------------ | :------------------------- |
| `id`                 | Number       | Unique identifier for the Iqub.                 | -                   | `id`                       |
| `name`               | String       | Name of the Iqub.                               | Required, Non-empty | `name`                     |
| `collector_id`       | Number       | ID of the User who is the Collector for this Iqub. | -                   | `user_id` (assumption)   |
| `saving_pattern`     | Number/String | Frequency of savings (e.g., 1 for Weekly, 2 for Daily - *Confirm mapping*). | Required | `saving_pattern`         |
| `saving_amount`      | String/Number| Amount each member saves per interval.          | Required, Numeric > 0 | `saving_amount`          |
| `credit_pattern`     | Number/String | Frequency of credit/pot distribution (*Confirm mapping*). | Required | `credit_pattern`         |
| `credit_amount`      | String/Number| Total amount distributed in each pot.           | Required, Numeric > 0 | `credit_amount`          |
| `members_count`      | Number       | Target number of members for the Iqub.          | Required, Integer > 1 | `members_count`          |
| `current_members`    | Number       | Current number of active members (Inferred).    | -                   | (From Member List API)     |
| `status`             | String       | Status of the Iqub (e.g., 'pending', 'active', 'completed'). | - | `status` (assumption)    |
| `created_at`         | String (ISO) | Timestamp when the Iqub was created.            | -                   | `created_at`             |
| `members`            | Array[`Member`] | List of members in the Iqub (Fetched separately). | - | (From Member List API)   |
| `hosted_lottery`     | String       | Progress indicator (e.g., "8/10")               | -                   | `hosted_lottery` (from `myIqubs`) |
| `total_collected`    | String/Number| Total amount collected so far (Inferred).       | -                   | `total_collected` (from `myIqubs`) |

## 3. Member (Iqub Participant)

Represents a user's membership within a specific Iqub.

| Field         | Type         | Description                                      | Frontend Validation | API Example Key (Inferred) |
| :------------ | :----------- | :----------------------------------------------- | :------------------ | :------------------------- |
| `id`          | Number       | Unique identifier for the membership record.     | -                   | `id`                       |
| `user_id`     | Number       | ID of the User who is the member.                | -                   | `user_id`                  |
| `iqub_id`     | Number       | ID of the Iqub this membership belongs to.       | -                   | `iqub_id`                  |
| `phone`       | String       | Member's phone number (for display/adding).      | -                   | `phone` (when adding)    |
| `name`        | String       | Member's name (for display).                     | -                   | `name` (from User profile) |
| `join_date`   | String (ISO) | Timestamp when the member joined the Iqub.       | -                   | `created_at` (assumption)  |
| `status`      | String       | Membership status (e.g., 'active', 'inactive').  | -                   | `status` (assumption)    |
| `saving_rounds` | String     | Progress indicator (e.g., "8/10").               | -                   | `saving_rounds` (from member list) |

## 4. API Response Structures (Examples)

*   **Login Response (Success):**
    ```json
    {
      "message": "Login successful.",
      "user": {
        "id": 1,
        "name": "Mickyas B",
        "phone": "+251911110000",
        "gender": "male",
        "role": "collector",
        "created_at": "2023-10-27T10:00:00.000000Z",
        "updated_at": "2023-10-27T10:00:00.000000Z"
        // Potentially other user fields
      },
      "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
    ```
*   **My Iqubs Response (Success):**
    ```json
     [
         {
            "id": 1,
            "user_id": 1,
            "name": "Iqub 1",
            "saving_pattern": "1", // Assuming 1 = Weekly
            "saving_amount": "100.00",
            "credit_pattern": "1",
            "credit_amount": "2000.00",
            "members_count": 20,
            "status": "active", // Assumption
            "created_at": "2023-10-27T10:00:00.000000Z",
            "updated_at": "2023-10-27T10:00:00.000000Z",
            "hosted_lottery": "8/10", // Example progress
            "total_collected": "12000.00" // Example progress
         },
         // ... more Iqubs
     ]
    ```

## 5. Agent Instructions

*   **TypeScript Interfaces:** Define TypeScript interfaces for `User`, `Iqub`, and `Member` based on these models. Use these interfaces in Vuex state, component props, and API client functions.
*   **Input Validation:** Implement client-side validation for forms (Signup, Create Iqub, Add Member) based on the `Frontend Validation` column. Use libraries like `VeeValidate` or built-in HTML5 validation enhanced with custom logic.
*   **Data Mapping:** When processing API responses, map the received data keys (e.g., `user_id`) to the corresponding frontend model fields (e.g., `collector_id`).
*   **Optional Fields:** Handle optional fields gracefully (e.g., `email`, `profile_picture_url`).
