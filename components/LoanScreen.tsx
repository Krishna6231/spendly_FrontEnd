import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import loanStyles from "@/styles/loans.styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useDispatch } from "react-redux";
import { deleteLentBorrowAsync, updateLentBorrowAsync } from "@/redux/slices/lentborrowSlice";
import { AppDispatch } from "@/redux/store";
import { Snackbar } from 'react-native-paper';

type Installment = {
  amount: number;
  date: string;
};

type Loan = {
  id: string;
  amount: number;
  name: string;
  type: "Lent" | "Borrow";
  date: string;
  installments: Installment[];
};

type LoanScreenProps = {
  loanList: any;
  openLoanEditModal: (loan: Loan) => void;
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LoanScreen: React.FC<LoanScreenProps> = ({ loanList, openLoanEditModal }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const styles = loanStyles(isDark);
  console.log(loanList)
  const [selectedType, setSelectedType] = useState<"Lent" | "Borrow">("Lent");
  const [expandedLoanIds, setExpandedLoanIds] = useState<string[]>([]);
  const [installmentChanges, setInstallmentChanges] = useState<
    Record<string, boolean>
  >({});
  const [newInstallments, setNewInstallments] = useState<
    Record<string, { amount: string; date: Date | null }>
  >({});

  const categorizedLoans = useMemo(() => {
    return loanList.filter((loan: any) => loan.type === selectedType);
  }, [loanList, selectedType]);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedLoanIds((prev) =>
      prev.includes(id) ? prev.filter((loanId) => loanId !== id) : [...prev, id]
    );
  };
  const getRemainingAmount = (loan: Loan) => {
    const paid = (loan.installments ?? []).reduce((acc, inst) => acc + inst.amount, 0);
    return loan.amount - paid;
  };
  const dispatch = useDispatch<AppDispatch>();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [activeInstallmentLoanId, setActiveInstallmentLoanId] = useState<string | null>(null);
  const [installmentInput, setInstallmentInput] = useState<Record<string, { amount: string, date: Date }>>({});
  const handleAddInstallment = (loan: Loan) => {
    const existing = loan.installments || [];
    const input = installmentInput[loan.id];
    if (!input?.amount || !input?.date) return;

    const updatedLoan = {
      ...loan,
      installments: [...existing, { amount: Number(input.amount), date: input.date }],
    };

    dispatch(updateLentBorrowAsync(updatedLoan))
      .unwrap()
      .then(() => {
        setSnackbarMessage("Installment added");
        setSnackbarVisible(true);
        setActiveInstallmentLoanId(null);
        setInstallmentInput(prev => ({ ...prev, [loan.id]: { amount: "", date: new Date() } }));
      })
      .catch((err) => {
        setSnackbarMessage("Failed to add installment");
        setSnackbarVisible(true);
      });
  };
  const handleDeleteInstallment = (loan: Loan, index: number) => {
    const updatedInstallments = [...(loan.installments || [])];
    updatedInstallments.splice(index, 1);

    const updatedLoan = {
      ...loan,
      installments: updatedInstallments,
    };

    dispatch(updateLentBorrowAsync(updatedLoan))
      .unwrap()
      .then(() => {
        setSnackbarMessage("Installment removed");
        setSnackbarVisible(true);
      })
      .catch(() => {
        setSnackbarMessage("Failed to remove installment");
        setSnackbarVisible(true);
      });
  };

  const handleDeleteLoan = (id: string) => {
    dispatch(deleteLentBorrowAsync(id))
      .unwrap()
      .then(() => {
        setSnackbarMessage("Loan deleted successfully");
        setSnackbarVisible(true);
      })
      .catch((error) => {
        setSnackbarMessage(error?.message || "Failed to delete loan");
        setSnackbarVisible(true);
      });
  };
  const [showDatePickerLoanId, setShowDatePickerLoanId] = useState<string | null>(null);

  return (
    <>
      <View style={styles.loanstypeselection}>
        {["Lent", "Borrow"].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setSelectedType(type as "Lent" | "Borrow")}
            style={[
              styles.hiscatsel,
              {
                backgroundColor: selectedType === type ? "#4b5563" : "#e5e7eb",
              },
            ]}
          >
            <Text style={{ color: selectedType === type ? "#fff" : "#374151" }}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {categorizedLoans.length === 0 ? (
        <Text style={styles.emptyText}>No {selectedType} Loans Yet</Text>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          {categorizedLoans.map((loan: any) => {
            const isExpanded = expandedLoanIds.includes(loan.id);
            const remaining = getRemainingAmount(loan);

            return (
              <View key={loan.id} style={styles.loanContainer}>
                <View style={styles.loanHeader}>
                  <Text style={styles.loanName}>{loan.name}</Text>
                  <Text style={styles.loanAmount}>₹{loan.amount}</Text>
                </View>
                <View style={styles.loanFooter}>
                  <Text style={styles.loanDate}>
                    {new Date(loan.date).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleExpand(loan.id)}
                  style={{ marginTop: 4, alignSelf: "flex-end" }}
                >
                  <Text style={styles.loanRemaining}>
                    Remaining amount: ₹{remaining} {isExpanded ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>

                {isExpanded && (
                  <>
                    <View style={styles.installmentsWrapper}>
                      {loan.installments?.length > 0 ? (
                        loan.installments.map((inst: any, index: any) => (
                          <View key={index} style={styles.ins}>
                            <View style={styles.installmentBox}>
                              <Text style={styles.installmentDate}>
                                {new Date(inst.date).toLocaleDateString()}
                              </Text>
                              <Text style={styles.installmentAmount}>
                                ₹{inst.amount}
                              </Text>
                            </View>
                            <TouchableOpacity style={styles.minus} onPress={() => handleDeleteInstallment(loan, index)}>
                              <AntDesign name="minus" size={20} color="black" />
                            </TouchableOpacity>

                          </View>
                        ))
                      ) : (
                        <View style={styles.emptyText}>
                          <Text style={styles.mttext}>No Installments</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.actionbtns}>
                      <TouchableOpacity style={styles.actionbtn} onPress={() => openLoanEditModal(loan)}>
                        <AntDesign name="edit" size={24} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionbtn} onPress={() => handleDeleteLoan(loan.id)}>
                        <AntDesign name="delete" size={24} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionbtn}
                        onPress={() => {
                          setActiveInstallmentLoanId(
                            activeInstallmentLoanId === loan.id ? null : loan.id
                          );
                          setInstallmentInput(prev => ({
                            ...prev,
                            [loan.id]: { amount: "", date: new Date() }
                          }));
                        }}
                      >
                        <AntDesign name="plus" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                    {activeInstallmentLoanId === loan.id && (
                      <View style={{ paddingHorizontal: 12, paddingTop: 10 }}>
                        <Text style={styles.mttext}>Add Installment</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Amount"
                          keyboardType="numeric"
                          value={installmentInput[loan.id]?.amount}
                          onChangeText={(text) =>
                            setInstallmentInput((prev) => ({
                              ...prev,
                              [loan.id]: { ...prev[loan.id], amount: text },
                            }))
                          }
                        />
                        <TouchableOpacity
                          onPress={() => setShowDatePickerLoanId(loan.id)}
                          style={[styles.input, { justifyContent: "center" }]}
                        >
                          <Text>
                            {installmentInput[loan.id]?.date
                              ? new Date(installmentInput[loan.id].date).toLocaleDateString()
                              : "Select Date"}
                          </Text>
                        </TouchableOpacity>

                        {showDatePickerLoanId === loan.id && (
                          <DateTimePicker
                            value={installmentInput[loan.id]?.date || new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                              setShowDatePickerLoanId(null); // hide picker
                              if (selectedDate) {
                                setInstallmentInput((prev) => ({
                                  ...prev,
                                  [loan.id]: { ...prev[loan.id], date: selectedDate },
                                }));
                              }
                            }}
                          />
                        )}

                        <TouchableOpacity
                          style={[styles.actionbtn, { marginTop: 10, alignSelf: 'flex-start' }]}
                          onPress={() => handleAddInstallment(loan)}
                        >
                          <Text style={{ color: 'black' }}>Add</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                  </>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </>
  );
};

export default LoanScreen;