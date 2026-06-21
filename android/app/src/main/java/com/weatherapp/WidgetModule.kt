package com.weatherapp

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

class WidgetModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "WidgetModule"

    @ReactMethod
    fun updateWidget(data: ReadableMap) {
        val city = data.getString("city") ?: "Częstochowa"
        val temp = data.getString("temp") ?: "--°C"
        val aqi = data.getString("aqi") ?: "Brak"
        val aqiColor = data.getString("aqiColor") ?: "#4CAF50"
        val icon = data.getString("icon") ?: "⛅"
        val lastUpdate = data.getString("lastUpdate") ?: ""

        WeatherWidget.saveWeatherData(
            reactContext, city, temp, aqi, aqiColor, icon, lastUpdate
        )
    }
}
