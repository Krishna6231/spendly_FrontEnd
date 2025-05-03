import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fdfdfd" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  piechart : {
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#f0f4ff",
    borderRadius: 13,
    elevation: 3,
  },
  fabInsideModal: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },

  dropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },

  dropdownItem: {
    paddingVertical: 8,
  },

  dropdownText: {
    fontSize: 16,
    color: "#333",
  },

  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#444",
  },

  userSummaryContainer: {
    alignSelf: "center",
    width: "100%",
    padding: 16,
    backgroundColor: "#f0f4ff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 20,
  },
  totalSpentLabel: {
    fontSize: 15,
    color: "black",
  },
  totalSpentAmount: {
    fontSize: 32,
    fontWeight: "900",
    color: "#00bcd4", // catchy blue
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  categoryCard: {
    backgroundColor: "#f0f4ff",
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
    height: 400,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  categoryName: {
    fontSize: 16,
    flex: 1,
  },

  categoryAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#007bff",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  fab2: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#000bff",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  inputLabel: {
    fontSize: 16,
    marginTop: 12,
    fontWeight: "600",
    color: "#444",
  },

  dropdownWrapper: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    overflow: "scroll",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 12,
  },

  dateInputWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  dateInput: {
    fontSize: 16,
    color: "#444",
  },

  addBtn: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  progressBarOut: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginTop: 10,
    overflow: "hidden",
  },

  cat_top_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  history: {
    padding: 7,
    textDecorationLine: "underline",
  }
});
export default styles;