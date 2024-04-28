<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The  great poor-mans firewall</title>
    <link rel="stylesheet" href="./css/output/tailwind-styles2.css">
    <link rel="stylesheet" href="./css/globals.css">
</head>
<body class="w-screen h-screen grid items-center">
    <div class="flex flex-col gap-4 p-4 justify-center items-center max-w-6/12">
        <h2 class=" text-3xl font-bold text-sky-950">Login if you are my teacher</h2>
        <form id="loginForm" action="./scripts/validate_teacher.php" method="POST">
            <div class="flex flex-col gap-2">
                <label for="username">Username is yourFirstName.toLowerCase():</label>
                <input class="rounded-md border-sky-950 border-2" type="text" required id="username" name="username">
            </div>
            <div class="flex flex-col gap-2">
                <label for="password">Password is the numeric part of the official email you publish on your page:</label>
                <input class="rounded-md border-sky-950 border-2" type="password" required id="password" name="password">
            </div>
<button class="relative inline-flex items-center justify-center p-0.5 mb-2 my-8 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
<span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-200 rounded-md group-hover:bg-opacity-0">
        Login
</span>
        </form>
    </div>

