# PERN-EBS
As I just learned how to use PERN stack (PostgreSQL database, Express backend, React frontend, Node.js framework) to build a fully functional web application, I wish to try using this stack to revive a legacy web game: Endless Battle Satellite.<br>
The newest known official version was built by ©NET GAME Communications in 2001 with Perl CGI

A newer version built with PHP was built by some Hongkonger/Taiwanese and posted on GitHub here: https://github.com/c0re100/PHP-Endless-Battle<br>
He/She addressed that the PHP Endless Battle Satellite (PHP-EBS) was discontinued.<br>
With spegatti code, that PHP-EBS is nearly impossible to maintain and debug.<br>
PHP-EBS is also vulnerable to SQL Injection, which I have learned how to prevent.<br>
PHP-EBS has incomplete server side form checking, which is also easier to deal with Express

PERN stack allows these to happen:
- Using JavaScript as the common programming language for front-end (React) and back-end (Express)
- Actually separate Model (database), View (front-end), Controller (back-end) into 3 logic components.
- Single Page Application (React), while need longer initial loading time, can react to user input faster.
- Data validation and sanitization using both React and Express, providing 2 layers of defense against injection attacks.
- Multiple libraries can be used at the same time for website security.
- A PostgreSQL database to store all information required.
- If OAuth 2.0 is implemented, Google accounts can be used for login.

# Weapon list in old EBS 1.05
Weapon list (ebs.cgi?WEAPON) contains information of most weapons in EBS.<br>
![image info](./ebs105_weaponlist.png)

And the source code looks like this<br>
![image info](./ebs105_weaponlist_src.png)

# Registering an account in old EBS 1.05 built by ©NET GAME Communications
Step 1<br>
![image info](./ebs105_reg1.png)
This step involves a post action, but the server side doesn't check the source of post.<br>
The server side does check if your desired player name collides with anyone else in this step.

Step 2<br>
![image info](./ebs105_reg2.png)
Your password is directly shown on the screen.<br>
This step involves a post action, again, the server side doesn't check the source of post.

# There are several vulnerabilities above, and my solutions
- 1: Weapon list<br><br>
  You can save the weapon list form action part to your computer, and change the form action URL as below:<br>
 `<form action="https://www.endless-battle.net/ebs.cgi" method="POST">`<br>
 The weapon IDs also have easily recognizable patterns, allowing the search for secret weapon information with ease.
  - For example you can add one line in the list of option tags to look for fortress weapon:<br>
    `<option value="zzzz">Fortress`, open the web page, choose this and click 検索 (Search)<br>
    You got it, the name is "ビッグキャノン" (Big Cannon), you can now update the name too!

  - Another example, you see that `<option value="aaaa">高出力ビームナギナタ` has one secret next generation weapon, the weapon ID of the next one should be "aaaaa"<br>
    Insert `<option value="aaaaa">secret` below the above option tag, refresh your local web page and try again, you got the name of the secret weapon now.<br>
    Repeat the process above, you are almost having access to all weapons in the list.
  
  Some EBS also uses the same path of the sample code for storing weapon information (/log/_hash.data), and allow all people to directly download the data.<br>


- 2: Password length<br><br>
  Original version only allows maximum password length of 8.<br>
  For normal players, limiting password to maximum 8 characters means they can have difficulty to use a secure password.<br>
  My version will limit the minimum password length to 8.<br>
  Instead, the maximum password length will be 72, which is same as the BCrypt hashed passwords and secrets.

- 3: Character(Personality) and Weapon cheats<br><br>
  In both steps, you can cheat by saving the registration page to your computer, and do modification of your saved registration page as below:<br>
    - Common: Modify `form action=./ebs.cgi` to `form action=https://www.endless-battle.net/ebs.cgi` (this is the exact EBS used for demonstration)
    - Cheat for step 1:<br>
      Between `<option value=5>冷酷` and `</select>` add `<br><option value=6>覚醒`, this adds a new character type.<br>
      copy the whole list in ebs.cgi?WEAPON, from `<option value="a">ビームナギナタ` to `<option value="yb">短弓` to replace the original list of weapons that you can choose
    - Cheat for step 2:<br>
      Save the page to your computer, modify as below<br>
      Modify `<input type=hidden name=chara value=0>` to `<input type=hidden name=chara value=6>` for awaken character<br>
      Modify `<input type=hidden name=w value=i>` to `<input type=hidden name=w value=zzzz>` for Big Cannon (the fortress weapon)<br>
      Modify the part looks like `<input type=hidden name=pass value=as_shown>` with a long password for your own security, they don't check.
    - Potentional hacking (XSS, SQL injection) concern:<br>
      The back end does nothing for data validation and sanitization, which can cause vulnerabilities.

- 4: Extremely insecure way to directly show password to the player in registration step 2<br>
  If you are using a public computer to register, and it happens that one person behind you is looking at your screen with malicious intent, your account will be hijacked easily.

- 5: The server side does NOT check if your desired player name collides with anyone else in step 2<br>
  A malicious player can hijack and even delete someone's account with a crafted registration confirmation page without even knowing his/her password!<br>
  This is the biggest vulnerability in EBS 1.05, which will not happen in PERN-EBS

# My solutions
To prevent cheating, hacking and add features at the same time, PERN-EBS will divide creating an account and creating a pilot into 2 steps, which can:
- Prevent new players registering an account and get powerful and/or expensive items instantly
- Allow players to create multiple pilots from single account, for now 4 is the max limit
- Data validation and sanitization will be done to both prevent cheating and code injection.
- I would classify weapons furthermore, like weapons for Mobile Suits, Mobile Fighters, Battleships, and Fortress.

PERN-EBS will save the weapon information in a database, but almost all attributes will be public including the actual attacking power of a weapon.<br>
Although this may let potential cheaters know about which weapon is the most powerful of all, a good security measure can prevent them from being able to cheat.
  
# Features different from the old EBS 1.05 built by ©NET GAME Communications
- Pilot has at least 6 kinds of attributes (inherited from Super Robot Wars series):
  - CQB: Close-Quarters Battle
  - RNG: Ranged Combat
  - SKL: Skill
  - DEF: Defense
  - EVD: Evasion
  - HIT: Accuracy
  The original EBS only implemented 4 attributes (ATK, DEF, EVD, HIT) for pilots.<br>
  Also, morale will be implemented, the mechanism will be determined in the future.

- Spirit command instead of strategy (inherited from Super Robot Wars series):<br>
  Your pilot can be equipped with at most 6 kinds of spirit commands at a time, depending on his/her level.<br>
  How those spirit commands are implemented will be determined in the future.

- Choose pilot type instead of character:<br>
  Your pilot was born as Natural, New Type, Coordinator, Innovade, Innovator, Accord<br>
  Natural pilots may be slightly weaker at first, but you will have options to train the natural pilot to become a different kind.<br>
  Other kinds of pilots are naturally better, but they don't have many options.<br>
  Although in Gundam SEED Freedom, Accords are stronger than Coordinators, don't forget that the only one survived is Lacus Clyne, not those fought against Coordinators.<br>
  So I will set the initial abilities of New Type, Coordinators and Accords to be nearly equal to each others.

- Team and Battleship<br>
  You can have a team with battleship, you don't directly control the battleship, but you can request support from battleship.<br>
  When you join a country, the high ranking officer has to assign you to a team if he/she decides to allow your admission.<br>
  You can still have join a team without joining a country.

- Others<br>
  I will update when I get some new ideas. The design phase of this project has not finished.<br>
  Feel free to give some suggestions.<br>
  You can give your suggestions in Japanese or Chinese(preferably traditional) too.
