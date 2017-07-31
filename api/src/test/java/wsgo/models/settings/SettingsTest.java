package wsgo.models.settings;

import org.junit.Test;
import wsgo.utils.EndpointTestCase;

import static org.junit.Assert.assertNotNull;

public class SettingsTest extends EndpointTestCase {

    @Test
    public void testCreate() {
        // TODO Auto-generated method stub
        String json = post("/settings", "{}");
        Settings settings = from(json, Settings.class);

        assertNotNull(settings);
    }

}
