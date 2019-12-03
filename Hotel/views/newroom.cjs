<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>RegistrationForm</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<!-- MATERIAL DESIGN ICONIC FONT -->
		<link rel="stylesheet" href="fonts/material-design-iconic-font/css/material-design-iconic-font.min.css">

		<!-- STYLE CSS -->
		<link rel="stylesheet" href="css/register.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <script src="js/strongpwd.js"></script>

	</head>

	<body>

		<div class="wrapper" style="background-image: url('images/bg-registration-form-1.jpg');">
			<div class="inner">
				<div class="image-holder">
					<img src="images/registration-form-1.jpg" alt="">
				</div>
                <form method="POST" action="/register">
					<h3>Add New Room</h3>
					<div class="form-group">
						<input type="text" name="roomID" placeholder="Room ID" class="form-control" required>
						<input type="text" name="roomName" placeholder="Room Name" class="form-control" required>
					</div>
					<div class="form-group">
						<input type="text" name="totelNum" placeholder="First Name" class="form-control" required>
						<input type="text" name="roomPrice" placeholder="Last Name" class="form-control" required>
					</div>
					<div class="form-group">
						<input type="text" name="bed_type" placeholder="First Name" class="form-control" required>
						<input type="text" name="roomPrice" placeholder="Last Name" class="form-control" required>
					</div>
					<div class="form-group">
						<input type="text" name="totelNum" placeholder="First Name" class="form-control" required>
						<input type="text" name="roomPrice" placeholder="Last Name" class="form-control" required>
					</div>
                    <button type="submit" id="Submit">
					    Register
						<i class="zmdi zmdi-arrow-right"></i>
					</button>
				</form>
			</div>
		</div>
        <div id="pswd_info">
            <h4>Password requirements</h4>
            <ul>
                <li id="letter" class="invalid">At least <strong>one letter</strong></li>
                <li id="capital" class="invalid">At least <strong>one capital letter</strong></li>
                <li id="number" class="invalid">At least <strong>one number</strong></li>
                <li id="length" class="invalid">Be at least <strong>8 characters</strong></li>
            </ul>
        </div>
	</body>
</html>