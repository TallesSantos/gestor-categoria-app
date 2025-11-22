import { Modal, Pressable, Text, View } from "react-native";

export function ConfirmDeleteModal({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <View
          style={{
            width: 280,
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 16, marginBottom: 20 }}>
            Tem certeza que deseja excluir este item?
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Pressable onPress={onCancel} style={{ marginRight: 20 }}>
              <Text>Cancelar</Text>
            </Pressable>

            <Pressable onPress={onConfirm}>
              <Text style={{ color: "red" }}>Excluir</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
