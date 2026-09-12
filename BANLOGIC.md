# Ban logic

When a user enters the wrong admin password too many times, their IP is banned.

- **Trigger:** 4 wrong password attempts from the same IP.
- **Duration:** 24 hours.
- **Storage:** Postgres table `login_attempts` (survives server restarts and cookie clearing).
- **User experience:** no error message is shown — the login page just reloads as if nothing happened.

## How it works

Each failed attempt inserts or increments a row keyed by IP. Once the count reaches 4, the row is reset and a `locked_until` timestamp is set 24 hours in the future. On every subsequent login request the server checks this timestamp first; if it is still in the future the request is silently redirected back to the login page with no cookie set.

On a successful login, any existing failure row for that IP is deleted.

## To manually lift a ban

```sql
DELETE FROM login_attempts WHERE ip = 'login:<ip-address>';
```
