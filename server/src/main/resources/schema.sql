CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(21) PRIMARY KEY,
    display_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(21),
    token_expiry_time TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(21) PRIMARY KEY,
    date TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    color VARCHAR(7),
    type SMALLINT,
    completed BOOLEAN DEFAULT FALSE,
    course_id VARCHAR(21),
    user_id VARCHAR(21),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(21) PRIMARY KEY,
    color VARCHAR(7),
    name VARCHAR(255),
    code VARCHAR(32),
    user_id VARCHAR(21),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS revoked_token (
    jwt_token_digest VARCHAR(255) PRIMARY KEY,
    revocation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
