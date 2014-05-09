<?php
	if (isset($_GET['data'])) {
		if (isset($_GET['date'])) {
			if (preg_match("/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/", $_GET['date'])) {
				$date = $_GET['date'];
			} else {
				die("pls don't hack :/");
			}
		} else {
			$date = date('m-d-Y');
		}
		$jsonData = base64_decode(str_replace('_', '/', str_replace('.', '=', $_GET['data'])));
		file_put_contents('./bp_arch/'.$date.'.json', $jsonData);
	} else {
		die('please specify a date to save your burning permit and the content to add to it.');
	}
?>
