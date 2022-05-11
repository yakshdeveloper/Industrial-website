<?php
  
  $subject = $_POST['subject'];
  $to_email = "sales@tirupatiinds.com";
  $from_email = $_POST['email'];
  $headers  = "MIME-Version: 1.0\r\n";
  $headers .= "Content-type: text/html; charset=utf-8\r\n";
  // Additional headers
  // This might look redundant but some services REALLY favor it being there.
  $headers .= "To: <$to_email>\r\n";
  $headers .= "From: <$from_email>\r\n";
  $message = $_POST['message'];
  $email = $_POST['email'];
  if (!mail($to_email, $subject, $message,$headers)) { 
    print_r(error_get_last());
  }
  else { ?>
    <!-- <h3 style="color:#d96922; font-weight:bold; height:0px; margin-top:1px;">Thank You For Contacting us!!</h3> -->
    <?php
   header("Location: https://www.tirupatiinds.com");
   exit;
?>
  <?php
  }
  ?>
  