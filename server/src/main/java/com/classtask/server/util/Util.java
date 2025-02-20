package com.classtask.server.util;

import com.soundicly.jnanoidenhanced.jnanoid.NanoIdUtils;

public class Util {
    public static boolean isNull(String item) {
        return item == null || item.isBlank();
    }

    public static String randomId() {
        return NanoIdUtils.randomNanoId();
    }
}
