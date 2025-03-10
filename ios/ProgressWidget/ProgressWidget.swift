import WidgetKit
import SwiftUI

// ProgressWidgetEntry 데이터 모델 정의
struct ProgressWidgetEntry: TimelineEntry {
    let date: Date
    let themeName: String
    let colors: [Color]
    let progress: Double
    let backgroundColor: Color
}

// Provider: 데이터를 제공하는 역할
struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> ProgressWidgetEntry {
        // Placeholder 데이터
      ProgressWidgetEntry(date: Date(), themeName: "Default Theme", colors: [Color.gray, Color.blue], progress: 0.7, backgroundColor: Color.black)
    }

    func getSnapshot(in context: Context, completion: @escaping (ProgressWidgetEntry) -> Void) {
        let entry = readThemeFromAppGroup()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<ProgressWidgetEntry>) -> Void) {
        let entry = readThemeFromAppGroup()
        let timeline = Timeline(entries: [entry], policy: .atEnd)
        completion(timeline)
    }
  
    private func calculateProgress() -> Double {
      let calendar = Calendar.current
      let startOfYear = calendar.date(from: DateComponents(year: calendar.component(.year, from: Date()), month: 1, day: 1))!
      let endOfYear = calendar.date(from: DateComponents(year: calendar.component(.year, from: Date()), month: 12, day: 31))!
      
      let totalDays = calendar.dateComponents([.day], from: startOfYear, to: endOfYear).day! + 1
      let passedDays = calendar.dateComponents([.day], from: startOfYear, to: Date()).day! + 1
      
      return Double(passedDays) / Double(totalDays)
    }

    private func readThemeFromAppGroup() -> ProgressWidgetEntry {
        // App Group에서 데이터 읽기
        let userDefaults = UserDefaults(suiteName: "group.com.seokho.progress")
        let themeName = userDefaults?.string(forKey: "selectedTheme") ?? "Default Theme"
        print("현재 테마 이름 : \(themeName)")
      
        // 기본 색상 및 진행 퍼센트
        let defaultColors = [Color.gray, Color.blue]
        let progress = calculateProgress()
      
      
        // colors 데이터 읽기
          if let colorData = userDefaults?.string(forKey: "colors") {
              print("App Group 저장된 colors 데이터: \(colorData)")
              
              // JSON 문자열을 배열로 디코딩
              if let colorStrings = try? JSONDecoder().decode([String].self, from: Data(colorData.utf8)) {
                  print("불러온 색상 데이터: \(colorStrings)")
                  let themeColors = colorStrings.compactMap { hexToColor(hex: $0) }
                  print("변환된 테마 색상: \(themeColors)")
                
                // widgetBackgroundColor 데이터 읽기
                            let backgroundColorHex = userDefaults?.string(forKey: "widgetBackgroundColor") ?? "#FFFFFF"
                print("읽어온 배경색 : \(backgroundColorHex)")
                            let backgroundColor = hexToColor(hex: backgroundColorHex)
                            
                
                return ProgressWidgetEntry(date: Date(), themeName: themeName, colors: themeColors, progress: progress, backgroundColor: backgroundColor)
              } else {
                  print("JSON 디코딩 실패")
              }
          } else {
              print("App Group에서 colors 데이터를 찾을 수 없음")
          }

          // 기본값 반환
          print("기본 색상 사용")
      return ProgressWidgetEntry(date: Date(), themeName: themeName, colors: defaultColors, progress: progress, backgroundColor: Color.black)
         
        
    }

    private func hexToColor(hex: String) -> Color {
        
        // # 기호 제거
        let hexString = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))

        let scanner = Scanner(string: hexString)
        var hexNumber: UInt64 = 0
      
        guard scanner.scanHexInt64(&hexNumber) else {
              print("Hex 변환 실패: \(hex)")
              return Color.gray // 기본 색상 반환
          }

        let r = Double((hexNumber & 0xFF0000) >> 16) / 255
        let g = Double((hexNumber & 0x00FF00) >> 8) / 255
        let b = Double(hexNumber & 0x0000FF) / 255

        //return Color(red: r, green: g, blue: b)
      
        let color = Color(red: r, green: g, blue: b)
        print("Hex 변환 성공: \(hex) -> \(color)")
        return color
    }
}

// ProgressWidgetEntryView: UI 구현
struct ProgressWidgetEntryView: View {
    var entry: ProgressWidgetEntry
  
    var body: some View {
      
      let adjustedProgress = max(entry.progress, 0.12) // 최소 진행률 12%
      
      let isDarkBackground = entry.backgroundColor == Color.black
      
      VStack {
        // 상단에 퍼센트 텍스트 (왼쪽 정렬)
        HStack {
          Text("\(Int(entry.progress * 100))%")
            .font(.system(size: 24, weight: .medium))
            .foregroundColor(isDarkBackground ? .white : .black)
          Spacer() // 오른쪽 여백 추가
        }
        .padding(.horizontal) // 좌우 여백 추가
        
        // 프로그레스바
              GeometryReader { geometry in
                  ZStack(alignment: .leading) {
                      // 배경 바
                      RoundedRectangle(cornerRadius: 10)
                      .fill(isDarkBackground ?  Color.white : Color.gray.opacity(0.2))
                          .frame(height: 20)
                    
                      // 진행 바
                    RoundedRectangle(cornerRadius: 10)
                      .fill(
                        LinearGradient(
                          gradient: Gradient(colors: entry.colors),
                          startPoint: .leading,
                          endPoint: .trailing
                        )
                      )
                      .frame(width: CGFloat(adjustedProgress) * geometry.size.width, height: 20) // 동적 너비 계산
                      //.cornerRadius(10)
                  }
                  .frame(height: 20) // 프로그레스바 높이
              }
              .frame(height: 20) // GeometryReader 높이 제한
          }
          .padding()
          .containerBackground(for: .widget) {
            entry.backgroundColor
          }
          .cornerRadius(12)
    }
}

// ProgressWidget: 위젯 설정
struct ProgressWidget: Widget {
    let kind: String = "progressWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            ProgressWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Progress Widget")
        .description("Displays the selected theme and progress bar.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
