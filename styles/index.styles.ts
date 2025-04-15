import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fdfdfd" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  categoryCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
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

  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
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
});
export default styles;
