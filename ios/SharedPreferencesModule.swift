import Foundation
import WidgetKit

@objc(SharedPreferencesModule)
class SharedPreferencesModule: NSObject {

    @objc func saveData(_ key: String, value: String, resolver: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
        let sharedDefaults = UserDefaults(suiteName: "group.com.seokho.progress")
        sharedDefaults?.set(value, forKey: key)
        resolver("Data saved successfully!")
    }

    @objc func getData(_ key: String, resolver: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) {
        let sharedDefaults = UserDefaults(suiteName: "group.com.seokho.progress")
        if let value = sharedDefaults?.string(forKey: key) {
            resolver(value)
        } else {
            rejecter("Error", "Data not found", nil)
        }
    }
  
  // 위젯 타임라인 새로고침 메서드 추가
     @objc func reloadWidgetTimelines() {
         print("reloadWidgetTimelines called")
         WidgetKit.WidgetCenter.shared.reloadAllTimelines()
         print("Widget timelines reloaded successfully!")
      }

    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }
}
