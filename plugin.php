<?php
/**
 * Plugin Name: ALPS Gutenberg Blocks
 * Plugin URI: https://adventist.io/themes
 * Description: Creates custom blocks in Gutenberg specific to the ALPS v3 theme.
 * Author: Seventh-day Adventist Church and SouthLeft
 * Author URI: https://adventist.io/themes
 * Version: 1.5.1
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define('ALPS_GUTENBERG_VERSION', '1.5.1');
define('ALPS_GUTENBERG_NAME', 'alps-gutenberg-blocks');

if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
    require __DIR__ . '/vendor/autoload.php';
}

require_once __DIR__ . '/src/init.php';
