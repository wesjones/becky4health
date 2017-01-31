<?php

if(isset($_POST['email'])) {



    // EDIT THE 2 LINES BELOW AS REQUIRED

    $email_to = "beckyjones150@msn.com";//"cybus10@gmail.com";

    $email_subject = "BECKY4HEALTH.COM REGISTRATION FORM";





    function died($error) {

        // your error code can go here

        echo "We are very sorry, but there were error(s) found with the form you submitted. ";

        echo "These errors appear below.<br /><br />";

        echo $error."<br /><br />";

        echo "Please go back and fix these errors.<br /><br />";

        die();

    }



    // validation expected data exists

    if(!isset($_POST['first_name']) ||

        !isset($_POST['last_name']) ||

        !isset($_POST['email']) ||

        !isset($_POST['phone']) ||

        !isset($_POST['gender'])) {

        died('We are sorry, but there appears to be a problem with the form you submitted.');

    }



    $first_name = $_POST['first_name']; // required

    $last_name = $_POST['last_name']; // required

    $email_from = $_POST['email']; // required

    $telephone = $_POST['phone']; // not required

    $comments = $_POST['gender']; // required



    $error_message = "";

    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';

  if(!preg_match($email_exp,$email_from)) {

    $error_message .= 'The Email Address you entered does not appear to be valid.<br />';

  }

    $string_exp = "/^[A-Za-z .'-]+$/";

  if(!preg_match($string_exp,$first_name)) {

    $error_message .= 'The First Name you entered does not appear to be valid.<br />';

  }

  if(!preg_match($string_exp,$last_name)) {

    $error_message .= 'The Last Name you entered does not appear to be valid.<br />';

  }

  if(strlen($comments) < 2) {

    $error_message .= 'The Comments you entered do not appear to be valid.<br />';

  }

  if(strlen($error_message) > 0) {

    died($error_message);

  }

    $email_message = "Form details below.\n\n";



    function clean_string($string) {

      $bad = array("content-type","bcc:","to:","cc:","href");

      return str_replace($bad,"",$string);

    }

    function fromCamelCase($camelCaseString) {
        $re = '/(?<=[a-z])(?=[A-Z])/x';
        $a = preg_split($re, $camelCaseString);
        return join($a, " " );
    }


    foreach($_POST as $k=>$v) {
        $email_message .= "<tr><td style=\"border-bottom:1px solid #666;width:200px;\">".fromCamelCase($k)."</td><td style=\"border-bottom:1px solid #666;\">".clean_string($v)."</td></tr>\n";
    }


// create email headers

$headers = 'MIME-Version: 1.0' . "\ r\n".
    'Content-type: text/html; charset=iso-8859-1' . "\ r\n".
    'From: Health Survey Form<healthform@becky4health.com>'." \r\n".
    'Reply-To: '.$email_from."\r\n" .
    'X-Mailer: PHP/' . phpversion();

$message = '<html><body>';
$message .= '<h1 style="color:#f40;">About '.$first_name.' '.$last_name.',</h1>';
$message .= '<table style="border:1px solid #000;">'.$email_message.'</table>';
$message .= '</body></html>';

@mail($email_to, $email_subject, $message, $headers);

?>



<!-- include your own success html here -->


<h3 style="text-align:center">Thank you for filling out the Initial Consultation Questionnaire from my Website. I look forward to meeting with you soon!  Sincerely, Becky Jones</h3>

<center>
<a href="http://www.becky4health.com">Home</a>
</center>



<?php

}

?>