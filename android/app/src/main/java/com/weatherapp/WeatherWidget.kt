package com.weatherapp

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.view.View
import android.widget.RemoteViews
import org.json.JSONObject

class WeatherWidget : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
            val views = RemoteViews(context.packageName, R.layout.weather_widget)

            try {
                val prefs = context.getSharedPreferences("widget_weather", Context.MODE_PRIVATE)
                val city = prefs.getString("city", "Częstochowa") ?: "Częstochowa"
                val temp = prefs.getString("temp", "--°C") ?: "--°C"
                val aqi = prefs.getString("aqi", "Brak") ?: "Brak"
                val aqiColor = prefs.getString("aqiColor", "#4CAF50") ?: "#4CAF50"
                val icon = prefs.getString("icon", "⛅") ?: "⛅"
                val lastUpdate = prefs.getString("lastUpdate", "") ?: ""

                views.setTextViewText(R.id.widget_city, city)
                views.setTextViewText(R.id.widget_temp, temp)
                views.setTextViewText(R.id.widget_icon, icon)
                views.setTextViewText(R.id.widget_aqi, "AQI: $aqi")
                views.setTextViewText(R.id.widget_update, lastUpdate)

                try {
                    views.setInt(R.id.widget_aqi_dot, "setBackgroundColor", Color.parseColor(aqiColor))
                } catch (e: Exception) {}

            } catch (e: Exception) {
                views.setTextViewText(R.id.widget_city, "Pogoda")
                views.setTextViewText(R.id.widget_temp, "--°C")
            }

            // Open app on tap
            val intent = Intent(context, MainActivity::class.java)
            val pendingIntent = android.app.PendingIntent.getActivity(
                context, 0, intent,
                android.app.PendingIntent.FLAG_UPDATE_CURRENT or android.app.PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_city, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }

        fun saveWeatherData(context: Context, city: String, temp: String, aqi: String, aqiColor: String, icon: String, lastUpdate: String) {
            val prefs = context.getSharedPreferences("widget_weather", Context.MODE_PRIVATE)
            prefs.edit()
                .putString("city", city)
                .putString("temp", temp)
                .putString("aqi", aqi)
                .putString("aqiColor", aqiColor)
                .putString("icon", icon)
                .putString("lastUpdate", lastUpdate)
                .apply()

            val manager = AppWidgetManager.getInstance(context)
            val ids = manager.getAppWidgetIds(
                android.content.ComponentName(context, WeatherWidget::class.java)
            )
            for (id in ids) updateAppWidget(context, manager, id)
        }
    }
}
