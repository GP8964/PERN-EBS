# PERN-EBS
I wish to try using PERN stack to remake a legacy web game: Endless Battle Satellite

# Known vulnerabilities about the old EBS 1.05 built by ©NET GAME Communications and my solutions:
1: Maximum password length is 8, which makes a password very insecure.
My version will limit the minimum password length to 8, instead, the maximum password length will be 72, which is same as the BCrypt hashed passwords and secrets.

2: Password is shown directly to the user on the account register confirmation.
I remembered that someone uses public computer to register an account, all his friends behind him see the password!
I'm going to remove the confirmation page, instead the registration should be complete before a confirmation message.
The message will NOT show the password directly!

3: Registration cheat
You could just modify some information in the form, like the weapon ID to create an account with a robot equipped with powerful weapon, or a weapon that costs a lot of money for sale.
PERN-EBS divides creating an account and creating a pilot into 2 steps, which can:
- Prevent new players from getting items that is not supposed for new players
- Allow players to create multiple pilots from single account, for now I would limit the number to 4
- Allow the implementation of combo attacks (like Jet Stream Attack)
